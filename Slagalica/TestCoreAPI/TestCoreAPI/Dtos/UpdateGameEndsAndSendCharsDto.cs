using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class UpdateGameEndsAndSendCharsDto
    {
        public MultiplayerGameDto MultiplayerGameDto { get; set; }
        public List<CharDto> Chars { get; set; }
    }
}
