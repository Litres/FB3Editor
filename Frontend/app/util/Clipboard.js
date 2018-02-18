/**
 * Утилита для рабты с буфером обмена (добавлена на будущее, так как пока не все браузеры поддерживают новый API).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.util.Clipboard',
    {
        singleton: true,

        /**
         * Записывает данные в буфер обмена.
         * @param {Object} dataTransfer Данные для записи в буфер.
         * @return {Promise}
         */
        write: function (dataTransfer)
        {
            var me = this,
                cb = me.getClipboard();

            return cb.write(dataTransfer);
        },

        /**
         * Записывает текст в буфер обмена.
         * @param {String} text
         * @return {Promise}
         */
        writeText: function (text)
        {
            var me = this,
                cb = me.getClipboard();

            return cb.writeText(text);
        },

        /**
         * Возвращает данные из буфера обмена.
         * @resolve {Object}
         * @return {Promise}
         */
        read: function ()
        {
            var me = this,
                cb = me.getClipboard();

            return cb.read();
        },

        /**
         * Возвращает текст из буфера обмена.
         * @resolve {String}
         * @return {Promise}
         */
        readText: function ()
        {
            var me = this,
                cb = me.getClipboard();

            return cb.readText();
        },

        /**
         * Возвращает объект для работы с данными из буфера.
         * @return {Object}
         */
        getDataTransfer: function ()
        {
            var me = this,
                cb = me.getClipboard(),
                dt;

            dt = new cb.DT();

            return dt;
        },

        /**
         * @private
         * Возвращает объект для работы с буфером.
         * @return {Object}
         */
        getClipboard: function ()
        {
                return clipboard;
        }
    }
);