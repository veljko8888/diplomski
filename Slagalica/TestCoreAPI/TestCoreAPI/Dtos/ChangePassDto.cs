using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class ChangePassDto
    {
        public string Email { get; set; }
        public string StariPassword { get; set; }
        public string NoviPassword { get; set; }
    }
}
