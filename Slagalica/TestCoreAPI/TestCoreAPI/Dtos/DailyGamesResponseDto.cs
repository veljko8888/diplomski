using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class DailyGamesResponseDto
    {
        public Guid Id { get; set; }
        public DateTime DailyGameDate { get; set; }
        public ConnectionDto Connection { get; set; }
        public AssociationDto Association { get; set; }
        public List<ConnectionDto> Connections { get; set; }
        public List<AssociationDto> Associations { get; set; }
        public bool StillNoOnePlayed { get; set; }
        public bool NoGamesSavedForDate { get; set; }
    }
}
