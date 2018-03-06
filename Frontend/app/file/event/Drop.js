/**
 * Событие открытие файла перетаскиванием в браузер.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.file.event.Drop',
    {
        extend: 'FBEditor.file.event.Abstract',

        getFile: function ()
        {
            var me = this,
                files = me.getFiles(),
                file;

            file = files ? files[0] : null;

            return file;
        },

        getFiles: function ()
        {
            var me = this,
                e = me.event,
                files = null;

            if (e.dataTransfer.items)
            {
                Ext.each(
                    e.dataTransfer.items,
                    function (item)
                    {
                        var file;

                        if (item.kind === 'file')
                        {
                            files = files || [];
                            file = item.getAsFile();
                            file = Ext.create('FBEditor.file.File', file);
                            files.push(file);
                        }
                    }
                );
            }
            else if (e.dataTransfer.files)
            {
                Ext.each(
                    e.dataTransfer.files,
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