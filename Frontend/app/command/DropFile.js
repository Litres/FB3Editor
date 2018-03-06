/**
 * Открывает файл, перетаскиваемый в браузер.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.command.DropFile',
    {
        extend: 'FBEditor.command.AbstractCommand',

        execute: function ()
        {
            var me = this,
                data = me.getData(),
                fileManager = FBEditor.file.Manager,
                evt,
                fileEvent,
                file,
                result;

            evt = data.evt;

            // событие
            fileEvent = Ext.create('FBEditor.file.event.Drop', evt);

            // файл
            file = fileEvent.getFile();

            // открываем книгу
            result = fileManager.openFB3(file);

            // очищаем данные
            fileEvent.clear();

            return result;
        },

        unExecute: function ()
        {
            // закрывает открытый файл
        }
    }
);