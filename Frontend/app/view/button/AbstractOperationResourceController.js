/**
 * Контроллер абстракатного класса кнопки для операций над ресурсом.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.button.AbstractOperationResourceController',
    {
        extend: 'Ext.app.ViewController',

        alias: 'controller.button.operation.resource',

        onClick: function ()
        {
            var me = this,
                view = me.getView(),
                cmdClass = view.cmdClass,
                cmd;

            cmd = Ext.create(cmdClass, {nameResource: view.nameResource});

            if (cmd && cmd.execute())
            {
                FBEditor.HistoryCommand.add(cmd);
            }
        }
    }
);