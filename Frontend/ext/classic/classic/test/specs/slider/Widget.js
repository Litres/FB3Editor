describe("Ext.slider.Widget", function() {
    var panel, slider;

    afterEach(function () {
        panel = slider = Ext.destroy(panel);
    });

    describe('binding', function () {
        var data, viewModel;

        beforeEach(function () {
            viewModel = new Ext.app.ViewModel({
                data: {
                    val: 20
                }
            });
            data = viewModel.getData();
        });

        function makeSlider (config) {
            panel = Ext.create({
                xtype: 'panel',
                renderTo:  Ext.getBody(),
                items: slider = Ext.create(Ext.apply({
                    xtype: 'sliderwidget',
                    bind: '{val}',
                    viewModel: viewModel,
                    width: 200,
                    height: 20,
                    animate: false
                }, config))
            });

            notify();
        }

        function notify () {
            viewModel.getScheduler().notify();
        }

        afterEach(function () {
            viewModel = Ext.destroy(viewModel);
        });

        it('should receive the initial value', function () {
            makeSlider();

            var v = slider.getValue();
            expect(v).toBe(20);
        });

//        it('should not update viewModel on setValue incomplete', function () {
//            makeSlider({
//                publishOnComplete: true
//            });
//
//            slider.setValue(50);
//            notify();
//
//            expect(data.val).toBe(20);
//        });

        it('should update viewModel on setValue complete', function () {
            makeSlider({
                publishOnComplete: true
            });

            slider.setValue(50);
            notify();

            expect(data.val).toBe(50);
        });

        it('should update viewModel on setValue when publishOnComplete:false', function () {
            makeSlider({
                publishOnComplete: false
            });

            slider.setValue(50);
            notify();

            expect(data.val).toBe(50);
        });
    });
});
