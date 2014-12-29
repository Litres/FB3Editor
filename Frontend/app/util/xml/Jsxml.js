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