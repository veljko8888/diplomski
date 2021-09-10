using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class GameAndUserDto
    {
        public Guid UserId { get; set; }
        public Guid GameId { get; set; }
        public string GameName { get; set; }
        public int AddPoints { get; set; }
        public int Points { get; set; }
        public int OpponentPoints { get; set; }
        public int EvalResult { get; set; }
        public string FieldName { get; set; }
        public string Value { get; set; }
        public Guid PlayerIdWhoSolved { get; set; }
        public List<string> SolvedCols { get; set; }
        public bool IsFinalSolved { get; set; }
        public bool ShouldUpdateSpojniceGamePoints { get; set; }
        public int Player1SlagalicaPoints { get; set; }
        public int Player2SlagalicaPoints { get; set; }
        public int Player1MojBrojPoints { get; set; }
        public int Player2MojBrojPoints { get; set; }
        public int Player1SkockoPoints { get; set; }
        public int Player2SkockoPoints { get; set; }
        public int Player1SpojnicePoints { get; set; }
        public int Player2SpojnicePoints { get; set; }
        public int Player1AsocijacijePoints { get; set; }
        public int Player2AsocijacijePoints { get; set; }
    }
}
