using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class MultiplayerGame
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime MultiplayerGameDate { get; set; }
        public int Player1Points { get; set; }
        public int Player2Points { get; set; }
        public Guid? Player1Id { get; set; }
        public virtual User? Player1 { get; set; }
        public Guid? Player2Id { get; set; }
        public virtual User? Player2 { get; set; }
        public Guid? WinnerId { get; set; }
        public virtual User? Winner { get; set; }
        public DateTime SlagalicaGameEnds { get; set; }
        public string Chars { get; set; }
        public string Nums { get; set; }
        public string Combination { get; set; }
        public bool Player1WordsFinished { get; set; }
        public bool Player2WordsFinished { get; set; }
        public int GameStatus { get; set; }
        public int Player1EvalResult { get; set; }
        public int Player2EvalResult { get; set; }
        public string SpojniceText { get; set; }
        public string SpojniceTextLeft { get; set; }
        public int OnMove { get; set; }
        public string FieldName { get; set; }
        public string Value { get; set; }
        public Guid PlayerIdWhoSolved { get; set; }
        public string SolvedForOpponent { get; set; }
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
