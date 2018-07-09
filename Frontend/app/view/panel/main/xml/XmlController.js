/**
 * Контроллер редактора xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.xml.XmlController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.view.xml',

        /**
         * Загружает данные в редактор xml.
         * @param {String} data Данные.
         */
        onLoadData: function (data)
        {
            var me = this,
                view = me.getView();

            view.loadData(data);
        }
    }
);