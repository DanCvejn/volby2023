import axios from "axios";
import { useEffect, useState } from "react";
import XMLParser from 'react-xml-parser';
import Candidate from "./components/Candidate";

function App() {
  const [data, setData] = useState();
  const [timeToFetch, setTimeToFetch] = useState(30);

  const fetch = async () => {
    const url = 'https://www.volby.cz/pls/prez2023/vysledky';
    const resXml = await axios.get(url, {
      "Content-Type": "application/xml; charset=utf-8"
    }).then((response) => {
      return response;
    })
    const resJson = new XMLParser().parseFromString(resXml.data);
    var finalData = {
      kandidati: [],
    };
    const date = new Date(resJson.attributes.DATUM_CAS_GENEROVANI);
    finalData.datum = date.getDate() + '. ' + (date.getMonth() + 1) + '. ' + date.getFullYear();
    finalData.cas = date.getHours() + ':' + date.getMinutes();
    resJson.children[0].children.map((person) => {
      if (person.name === 'KANDIDAT') {
        var kandidat = {};
        kandidat.name = person.attributes.JMENO + ' ' + person.attributes.PRIJMENI;
        if (person.attributes.TITULPRED !== '') kandidat.name = person.attributes.TITULPRED + ' ' + kandidat.name;
        if (person.attributes.TITULZA !== '') kandidat.name = kandidat.name + ' ' + person.attributes.TITULZA;
        kandidat.number = person.attributes.PORADOVE_CISLO;
        kandidat.firstRound = person.attributes.HLASY_PROC_1KOLO;
        if (person.attributes.ZVOLEN_1KOLO !== 'NEZVOLEN') kandidat.secondRound = person.attributes.HLASY_PROC_2KOLO;
        finalData.kandidati.push(kandidat);
      }
    })
    finalData.kandidati.sort((candidateA, candidateB) => candidateB.firstRound - candidateA.firstRound);
    if (finalData.kandidati[0].secondRound < finalData.kandidati[1].secondRound) {
      var tmp = finalData.kandidati[0];
      finalData.kandidati[0] = finalData.kandidati[1];
      finalData.kandidati[1] = tmp;
    }
    finalData.kandidati[0].nextPresident = true;
    finalData.stats = {};
    var tmpStats = resJson.children[0].children[resJson.children[0].children.length - 1].attributes;
    finalData.stats.total = tmpStats.OKRSKY_CELKEM;
    finalData.stats.count = tmpStats.OKRSKY_ZPRAC_PROC;
    finalData.stats.participation = tmpStats.UCAST_PROC;
    console.log(finalData.stats);
    if (parseInt(finalData.stats.count) === 100) {
      finalData.kandidati[0].president = true;
    }
    setData(finalData);
  }

  const startFetching = () => {
    const countdown = setInterval(async () => {
      await fetch();
    }, 30000);
    if (data?.stats?.count === 100) clearInterval(countdown);
  }

  useEffect(() => {
    fetch();
    startFetching();
  }, [])


  if (!data) return (<h1>Getting data</h1>)

  return (
    <div className="content">
      <div className="title">
        <h1>Volby 2023</h1>
        <p>{data.cas} - {data.datum}</p>
      </div>
      <div className="stats">
        <p>Sečteno: <b>{data.stats.count}% z 100%</b> <span className="light">Celkem okresků: {data.stats.total}</span></p>
        <p>Účast: <b>{data.stats.participation}%</b></p>
        <p>Obnova dat každých <b>{timeToFetch}s</b></p>
      </div>
      <div className="candidates">
        {data.kandidati.map(person => {
          return (
            <Candidate data={person} />
          )
        })}
      </div>
    </div>
  )
}

export default App
