/**
 * Контроллер кнопки замены ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.resource.replacer.button.replace.ReplaceController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.resource.replacer.button.replace',

        onClick: function ()
        {
            var me = this,
                view = me.getView(),
                resData,
                manager,
                win;

            win = view.getWindow();

            // закрываем окно
            win.close();

            resData = win.getResourceData();
            manager = win.getResourceManager();

            // заменяем ресурс с имеющимся именем на новый
            manager.replaceResource(resData);
        }
    }
);