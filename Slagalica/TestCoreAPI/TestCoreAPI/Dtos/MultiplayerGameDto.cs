using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCoreAPI.Models;

namespace TestCoreAPI.Dtos
{
    public class MultiplayerGameDto
    {
        public Guid Id { get; set; }
        public DateTime MultiplayerGameDate { get; set; }
        public int Player1Points { get; set; }
        public int Player2Points { get; set; }
        public Guid? Player1Id { get; set; }
        public Guid? Player2Id { get; set; }
        public Guid? WinnerId { get; set; }
        public int GameStatus { get; set; }
        public UserDto Player1 { get; set; }
        public UserDto Player2 { get; set; }
        public UserDto Winner { get; set; }
        public DateTime SlagalicaGameEnds { get; set; }
    }
}
