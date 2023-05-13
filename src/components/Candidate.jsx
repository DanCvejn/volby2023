import styled from "styled-components";

const Candidate = ({ data }) => {
  const FirstRoundLine = styled.div`
    background: #E9FAC8;
    height: 5px;
    width: ${data.firstRound}%;
    transition: .3s;
  `

  const SecondRoundLine = styled.div`
    background: #20baff;
    height: 5px;
    width: ${data.secondRound}%;
    transition: .3s;
  `

  return (
    <div className={data.secondRound ? 'candidate' : 'candidate not-voted'}>
      <h2 className="name">{data.name} <span className="light">({ data.number })</span></h2>
      <div className="vote-lines">
        <div className="line">
          <FirstRoundLine />
          <p className="procent">{data.firstRound}%</p>
        </div>
        <div className="line">
          {data.secondRound &&
            <>
              <SecondRoundLine />
              <p className="procent">{data.secondRound}%</p>
            </>
          }
        </div>
      </div>
      {data.nextPresident &&
        <p className="president">
          {data.president ? 'PREZIDENT' : 'Nastávající prezident'}
        </p>
      }
    </div>
  )
}

export default Candidate