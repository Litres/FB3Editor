/**
 * Контроллер кнопки замены имени ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.resource.replacer.button.rename.RenameController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.resource.replacer.button.rename',

        onClick: function ()
        {
            var me = this,
                view = me.getView(),
                newResData,
                resourceName,
                resData,
                manager,
                win;

            win = view.getWindow();

            // закрываем окно
            win.close();

            resData = win.getResourceData();
            manager = win.getResourceManager();

            // новое имя для ресурса
            resourceName = manager.getNewResourceName(resData.name);

            // заменяем данные ресурса на новые
            newResData = Ext.clone(resData);
            newResData.rootName = resData.rootName.replace(resData.name, resourceName);
            newResData.name = newResData.baseName = resourceName;

            // создаём ресурс с новым именем
            manager.createResource(newResData);
        }
    }
);