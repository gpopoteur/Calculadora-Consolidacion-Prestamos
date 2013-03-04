using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Calculadora.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult getTabla(Models.Deuda deuda)
        {
            var tabla = Models.Tabla.getTablaAmortizacion(deuda);
            return Json(new { tabla = tabla, meses = tabla.Last().mes, consolidacion = tabla.Sum(x => x.interes) });
        }

        [HttpPost]
        public ActionResult getConsolidacion(double monto, double interes, int meses, double pagoActual)
        {
            // Cuota nuevo Prestamo
            var cuota = Models.Amortizacion.getCuota(monto, interes/100, meses);

            // Busco la mejor cuota
            while(cuota >= pagoActual)
            {
                meses++;
                cuota = Models.Amortizacion.getCuota(monto, interes/100, meses);
            }
            
            // El nuevo prestamo es una Deuda
            // Lo puedo tratar como tal
            var deuda = new Models.Deuda()
                            {
                                cuota = cuota,
                                monto = monto,
                                tasaInteres = interes
                            };

            // Obtengo la tabla del nuevo prestamo
            var tabla = Models.Tabla.getTablaAmortizacion(deuda);

            return Json(new { tabla = tabla, meses = meses, interes = interes, cuota = cuota, consolidacion = tabla.Sum(x => x.interes) });
        }
    }
}
