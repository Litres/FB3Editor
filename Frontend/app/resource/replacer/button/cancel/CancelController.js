/**
 * Контроллер кнопки отмены операции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.resource.replacer.button.cancel.CancelController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.resource.replacer.button.cancel',

        onClick: function ()
        {
            var me = this,
                view = me.getView(),
                win;

            win = view.getWindow();
            win.close();
        }
    }
);