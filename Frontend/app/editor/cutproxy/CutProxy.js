/**
 * Прокси для данных из буфера обмена, вырезаемых из редактора.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.cutproxy.CutProxy',
	{
		requires: [
			'FBEditor.util.ClipboardData'
		],

		/**
		 * @protected
		 * @property {FBEditor.editor.Manager} Менеджер редактора.
		 */
		manager: null,

		/**
		 * @private
		 * @property {String} Вырезаемый фрагмент в виде html.
		 */
		html: null,

		/**
		 * @private
		 * @property {FBEditor.util.ClipboardData} Синглтон для работы с буфером.
		 */
		clipboardData: null,

		/**
		 * @param {Object} data
		 * @param {Object} data.e Объект события вставки.
		 * @param {Object} data.manager Менеджер редактора.
		 */
		constructor: function (data)
		{
			var me = this,
				evt = data.e;

			me.manager = data.manager;

			// объект для работы с буфером
			me.clipboardData = Ext.create('FBEditor.util.ClipboardData', evt);
		},

		/**
		 * Устанавливает данные в буфер обмена.
		 * @param {String} xml Строка.
		 */
		setData: function (xml)
		{
			var me = this,
				clipboardData = me.clipboardData;

			clipboardData.setHtml(xml);
		}
	}
);