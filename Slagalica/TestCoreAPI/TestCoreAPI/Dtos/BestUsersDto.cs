using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class BestUsersDto
    {
        public List<BestUserDto> Rank7Days { get; set; }
        public List<BestUserDto> RankCurrentMonth { get; set; }
    }
}
