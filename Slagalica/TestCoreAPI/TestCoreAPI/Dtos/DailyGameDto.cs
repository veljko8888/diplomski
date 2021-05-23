using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class DailyGameDto
    {
        public Guid Id { get; set; }
        public DateTime DailyGameDate { get; set; }
        public Guid ConnectionId { get; set; }
        public Guid AssociationId { get; set; }
    }
}
