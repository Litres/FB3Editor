/**
 * Контроллер абстрактной кнопки загрузки ресурса.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.button.resource.AbstractLoadResourceController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.button.abstractload.resource',

        onChange: function (btn, evt)
        {
            var me = this,
                view = me.getView(),
                cmdClass,
                cmd;

            cmdClass = view.cmdClass;
            cmd = Ext.create(cmdClass, {evt: evt});

            if (cmd.execute())
            {
                FBEditor.HistoryCommand.add(cmd);
            }
        }
    }
);