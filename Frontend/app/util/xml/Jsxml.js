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
				jsxml = me.jsxml || me.createJsxml();

			return jsxml.transReady(xml, xsl);
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