using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Calculadora.Models
{
    public class Tabla
    {
        /// <summary>
        /// Crea una tabla de amortizacion a partir
        /// de una deuda.
        /// </summary>
        /// <param name="d">Deuda</param>
        /// <returns>Tabla de Amortizacion</returns>
        public static List<Amortizacion> getTablaAmortizacion(Deuda d)
        {
            var tabla = new List<Amortizacion>();
            var balance = d.monto;
            var mes = 1;

            while(balance >= 0.0009)
            {
                var interes = ((d.tasaInteres/100)/12)*balance;
                var principal = d.cuota - interes;
                var fila = new Amortizacion()
                               {
                                   mes = mes,
                                   balancePartida = balance,
                                   pagoMensual = d.cuota,
                                   interes = interes,
                                   principal = principal,
                                   balanceSalida =  balance - principal
                               };

                balance = fila.balanceSalida;
                mes++;

                // Almaceno la fila en la tabla
                tabla.Add(fila);
            }

            return tabla;
        }
    }
}