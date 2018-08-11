/**
 * Утилита для работы с xml и xslt (адаптер).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.util.xml.Jsxml',
	{
		singleton: true,

		/**
		 * @private
		 * @property {JSXML} Внешняя библиотека.
		 */
		jsxml: null,

		/**
		 * Выполняет преобразование xml с помощью xslt.
		 * @param {String} xml Строка xml.
		 * @param {String} xsl Строка xsl.
		 * @return {String} Преобразованная строка.
		 */
		trans: function (xml, xsl)
		{
			var me = this,
				jsxml,
                err,
                transStr;

            jsxml = me.jsxml || me.createJsxml();

            try
			{
				transStr = jsxml.transReady(xml, xsl);
            }
            catch (e)
			{
				err = e.message;
                err = err.match(/ errors:(.*?)\n/i);
				e.error = err[1] || err;

				throw e;
			}

			return transStr;
		},

		/**
		 * Проверяет валидность xml по схеме xsd.
		 * Возвращает true или сообщение об ошибке.
		 * @param {Object} options Опции.
		 * @param {String} options.xml Строка xml.
		 * @param {String} options.xsd Строка xsd.
		 * @param {String} options.xmlFileName Имя файла xml.
		 * @param {String} options.schemaFileName Имя файла xsd.
		 * @return {Boolean|String} Успешна ли валидация.
		 */
		valid: function (options)
		{
			var result,
				data;

			data = {
				xml: options.xml,
				schema: options.xsd,
				arguments: ["--noout", "--schema", options.schemaFileName, options.xmlFileName]
			};
			result = window.validateXML ? window.validateXML(data) : true;

			return result;
		},

		/**
		 * @private
		 * Создает объект внешней библиотеки.
		 * @return {JSXML} Внешняя библиотека.
		 */
		createJsxml: function ()
		{
			var me = this,
				jsxml;

			jsxml = window.JSXML;
			me.jsxml = jsxml;

			return jsxml;
		}
	}
);