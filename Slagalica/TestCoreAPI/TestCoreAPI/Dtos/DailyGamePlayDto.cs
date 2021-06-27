using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class DailyGamePlayDto
    {
        public Guid Id { get; set; }
        public DateTime DailyGameDate { get; set; }
        public int Points { get; set; }
        public Guid UserId { get; set; }
    }
}
