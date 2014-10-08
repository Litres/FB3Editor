/**
 * Преобразует xml в json и обратно (адаптер).
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.util.xml.Json',
	{
		singleton: true,

		/**
		 * @property {String} Префикс перед именем свойств в json.
		 */
		prefix: ' ',

		/**
		 * @private
		 * @property {X2JS} Внешняя библиотека для преобразований.
		 */
		x2js: null,

		/**
		 * Преобразует текст xml в объект json.
		 * @param {String} text Текст xml.
		 * @return {Object} Объект json.
		 */
		xmlToJson: function (text)
		{
			var me = this,
				x2js = me.x2js || me.createX2Js();

			return x2js.xml_str2json(text);
		},

		/**
		 * @private
		 * Создает объект внешней библиотеки.
		 * @return {X2JS} Внешня библиотека.
		 */
		createX2Js: function ()
		{
			var me = this,
				prefix = me.prefix ? me.prefix : ' ',
				x2js;

			x2js = new X2JS(
				{
					attributePrefix: prefix
				}
			);
			me.x2js = x2js;

			return x2js;
		}
	}
);