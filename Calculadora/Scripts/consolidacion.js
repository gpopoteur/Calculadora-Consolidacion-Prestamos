function Tabla(title, tabla) {
    var self = this;
    self.title = title;
    self.tabla = tabla;
}

function Deuda(tipo, monto, cuota, tasaInteres) {
    var self = this;
    self.tipo = tipo;
    self.monto = monto;
    self.cuota = cuota;
    self.tasaInteres = tasaInteres;
    self.meses = 0;
}

function ViewModel() {
    var self = this;

    // Formulario de deudas
    self.tipo = ko.observable();
    self.monto = ko.observable();
    self.cuota = ko.observable();
    self.tasaInteres = ko.observable();

    //Deudas
    self.deudas = ko.observableArray();

    // Total Adeudado
    self.totalAdeudado = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < self.deudas().length; i++) {
            total += Number(self.deudas()[i].monto);
        }

        return total;
    });

    // Pagos por mes
    self.pagosPorMes = ko.computed(function () {
        var total = 0;
        for (var i = 0; i < self.deudas().length; i++) {
            total += Number(self.deudas()[i].cuota);
        }

        return total;
    });

    // Gastos de Cierre en %
    self.gastosCierre = Number(1);
    
    // Monto nuevo Prestamo
    self.montoNuevoPrestamo = ko.computed(function () {
        var total = Number(self.totalAdeudado());

        return total + (total * (self.gastosCierre/100));
    });
    
    // Intereses Deudas
    self.interesDeudas = ko.observable(0);

    // Interes Consolidacion
    self.interesConsolidacion = ko.observable(0);

    // Consolidacion
    self.costoConsolidacion = ko.computed(function () {
        var consolidacion = self.interesConsolidacion() - self.interesDeudas();
        return consolidacion.toFixed(2);
    });
    
    self.pagoNuevoPrestamo = ko.observable(0);
    self.cashFlow = ko.computed(function () {
        var flow = Number(self.pagosPorMes()) - Number(self.pagoNuevoPrestamo());
        return flow.toFixed(2);
    });
    
    // Tasa nuevo prestamo
    self.tasa = ko.observable(12);
    
    // Duracion Meses nuevo prestamo
    self.duracionMeses = ko.observable(10);

    // Tablas
    self.tablas = ko.observableArray([
        new Tabla('Consolidacion', [])
    ]);

    self.addTabla = function (tabla) {
        self.tablas.push(tabla);
    };

    // Active Section
    self.active = ko.observable();
    self.markActive = function (section) {
        self.active(section);
    };
    
    // Agregar Deuda
    self.addDeuda = function () {
        var tipo = self.tipo();
        var d = new Deuda(tipo, self.monto(), self.cuota(), self.tasaInteres());

        // Calculo la tabla
        $.ajax("/home/getTabla", {
            data: ko.toJSON({ deuda: d }),
            type: "post", contentType: "application/json",
            success: function (result) {
                if(result !== undefined) {
                    // Agrego la deuda
                    d.meses = result.meses;
                    self.deudas.push(d);
                    
                    // Revisar Meses
                    if (result.meses > self.duracionMeses()) {
                        self.duracionMeses(result.meses);
                    }
                    
                    // Agrego la consolidacion
                    self.interesDeudas( Number(self.interesDeudas()) + Number(result.consolidacion) );
                    console.log(self.interesDeudas());

                    // Limpio los campos
                    self.tipo("");
                    self.monto("");
                    self.cuota("");
                    self.tasaInteres("");

                    // Agrego la tabla
                    self.addTabla(new Tabla(tipo, result.tabla));

                    // Recalculo el nuevo Prestamo
                    self.getNuevoPrestamo(self.montoNuevoPrestamo(), self.tasa(), self.duracionMeses(), self.pagosPorMes());
                }
            }
        });
    };

    self.getNuevoPrestamo = function(monto, interes, meses, pagoActual) {
        // Calculo la tabla
        $.ajax("/home/getConsolidacion", {
            data: ko.toJSON({ monto: monto, interes: interes, meses: meses, pagoActual: pagoActual }),
            type: "post", contentType: "application/json",
            success: function (result) {
                if (result !== undefined) {
                    // Completo los nuevos datos
                    self.tasa(result.interes);
                    self.duracionMeses(result.meses);
                    self.pagoNuevoPrestamo(result.cuota.toFixed(2));
                    self.interesConsolidacion(result.consolidacion);
                    console.log(self.interesConsolidacion());

                    // Actualizo la tabla del nuevo prestamo
                    self.tablas.replace(self.tablas()[0], {
                        title: 'Consolidacion',
                        tabla: result.tabla
                    });
                }
            }
        });
    };
}

ko.applyBindings(new ViewModel());