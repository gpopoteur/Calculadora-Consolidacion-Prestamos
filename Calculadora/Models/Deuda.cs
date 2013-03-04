using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Calculadora.Models
{
    public class Deuda
    {
        public string tipo { get; set; }
        public double monto { get; set; }
        public double cuota { get; set; }
        public double tasaInteres { get; set; }


    }
}