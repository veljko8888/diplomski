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
    }
}
