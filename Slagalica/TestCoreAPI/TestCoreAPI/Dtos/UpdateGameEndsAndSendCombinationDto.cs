using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class UpdateGameEndsAndSendCombinationDto
    {
        public MultiplayerGameDto MultiplayerGameDto { get; set; }
        public List<string> Combination { get; set; }
        public Guid UserId { get; set; }
    }
}
