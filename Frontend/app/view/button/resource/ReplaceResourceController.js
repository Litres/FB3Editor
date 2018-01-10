/**
 * Контроллер кнопки замены ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.button.resource.ReplaceResourceController',
    {
        extend: 'FBEditor.view.button.resource.AbstractLoadResourceController',

        alias: 'controller.button.replace.resource',

        onChange: function (btn, evt)
        {
            var me = this,
                view = me.getView(),
                nameResource,
                cmdClass,
                cmd;

            cmdClass = view.cmdClass;
            nameResource = view.nameResource;
            cmd = Ext.create(cmdClass, {evt: evt, nameResource: nameResource});

            if (cmd.execute())
            {
                FBEditor.HistoryCommand.add(cmd);
            }
        }
    }
);