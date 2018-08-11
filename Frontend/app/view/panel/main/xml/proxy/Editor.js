/**
 * Прокси для стороннего редактора xml.
 * Используется http://codemirror.net
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.xml.proxy.Editor',
    {
        /**
         * @private
         * @property {CodeMirror} Сторонний редактор xml.
         */
        lib: null,

        constructor: function ()
        {
            var me = this;

            me.lib = CodeMirror;
        },

        /**
         * Инициализирует прокси.
         * @param {FBEditor.view.panel.main.xml.Xml} panel Панель редактора xml.
         */
        init: function (panel)
        {
            var me = this,
                lib = me.getLib(),
                content;

            content = panel.getContent();

            me.lib = lib = lib(
                content,
                {
                    mode: 'xml'
                }
            );

            lib.setSize('100%', '100%');
        },

        /**
         * Возвращает используемый редактор xml.
         * @return {CodeMirror}
         */
        getLib: function ()
        {
            return this.lib;
        },

        /**
         * Устанавливает содержимое редатора xml.
         * @param {String} data Данные.
         */
        setData: function (data)
        {
            var me = this,
                lib = me.getLib();

            lib.setValue(data);
        },

        /**
         * Возвращает содержимое редактора xml.
         * @return {String} Данные.
         */
        getData: function ()
        {
            var me = this,
                lib = me.getLib(),
                data;

            data = lib.getValue();

            return data;
        },

        /**
         * Устанавливаем перенос длинных строк.
         * @param {Boolean} wrap true - включить перенос.
         */
        setLineWrap: function (wrap)
        {
            var me = this,
                lib = me.getLib();

            lib.setOption('lineWrapping', wrap);
        }
    }
);