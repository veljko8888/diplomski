using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class UpdateGameEndsAndSendNumsDto
    {
        public MultiplayerGameDto MultiplayerGameDto { get; set; }
        public List<NumDto> Nums { get; set; }
        public int FinalNum { get; set; }
    }
}
