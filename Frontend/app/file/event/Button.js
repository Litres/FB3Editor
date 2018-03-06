/**
 * Событие открытие файла при помощи кнопки из браузера.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.file.event.Button',
    {
        extend: 'FBEditor.file.event.Abstract',

        getFiles: function ()
        {
            var me = this,
                e = me.event,
                files = null;

            if (e.target.files)
            {
                Ext.each(
                    e.target.files,
                    function (item)
                    {
                        var file;

                        files = files || [];
                        file = Ext.create('FBEditor.file.File', item);
                        files.push(file);
                    }
                );
            }

            return files;
        }
    }
);