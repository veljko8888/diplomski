using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class SpojniceRestAndShuffleDto
    {
        public List<ShuffledSpojnicaDto> SpojniceShuffledState { get; set; }
        public List<ShuffledSpojnicaDto> SpojniceLeftSide { get; set; }
        public MultiplayerGameDto MultiplayerGameDto { get; set; }
        public Guid UserId { get; set; }
    }
}
