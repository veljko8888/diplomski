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
    }
}
