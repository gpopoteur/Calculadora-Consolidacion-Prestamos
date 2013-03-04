using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Calculadora.Models
{
    public class Amortizacion
    {
        public int mes { get; set; }
        public double balancePartida { get; set; }
        public double pagoMensual { get; set; }
        public double principal { get; set; }
        public double interes { get; set; }
        public double balanceSalida { get; set; }

        /// <summary>
        /// Devuelve el monto de las cuotas fijas.
        /// </summary>
        /// <param name="monto">Monto del prestamo</param>
        /// <param name="interes">Interes Anual del prestamo en porciento</param>
        /// <param name="meses">Cantidad de Meses</param>
        /// <returns>Cuota mensual</returns>
        public static double getCuota(double monto, double interes, int meses)
        {
            interes = interes/12;
            var denominador = ( 1 - Math.Pow(1 + interes, -1*meses) ) / interes;
            var cuota = monto/denominador;

            return cuota;
        }

    }
}