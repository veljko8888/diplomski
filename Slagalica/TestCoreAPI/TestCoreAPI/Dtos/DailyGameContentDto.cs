using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class DailyGameContentDto
    {
        public ConnectionDto Connections { get; set; }
        public AssociationDto Associations { get; set; }
    }
}
