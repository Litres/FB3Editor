/**
 * Абстрактный класс события получения файла браузером.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.file.event.Abstract',
    {
        /**
         * @private
         * @property {Object} Событие.
         */
        event: null,

        /**
         * @param {Object} e Событие.
         */
        constructor: function (e)
        {
            var me = this;

            me.event = e;
        },

        /**
         * @abstract
         * Возвращает список файлов из события.
         * @return {FBEditor.file.File[]}
         */
        getFiles: function ()
        {
            throw Error('Необходимо переопределить метод FBEditor.file.event.Abstract#getFiles()');
        },

        /**
         * Возвращает первый файл из события (файлов может быть несколько).
         * @return {FBEditor.file.File}
         */
        getFile: function ()
        {
            var me = this,
                files = me.getFiles(),
                file;

            file = files ? files[0] : null;

            return file;
        },

        /**
         * Очищает данные.
         */
        clear: function ()
        {
            var me = this,
                e = me.event;

            if (e.dataTransfer.items)
            {
                e.dataTransfer.items.clear();
            }
            else
            {
                e.dataTransfer.clearData();
            }
        }
    }
);