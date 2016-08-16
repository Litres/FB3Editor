/**
 * Пустая панель для центральной части.
 * Используется в качестве заглушки, чтобы не показывать другие, если это требуется.
 * Может содержать информационные сообщения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.empty.Empty',
	{
		extend: 'Ext.panel.Panel',

		id: 'panel-empty',
		xtype: 'panel-empty',
		cls: 'panel-empty',

		layout: 'center',

		/**
		 * @private
		 * @property {Ext.Component}
		 */
		_textPanel: null,

		translateText: {
			defaultText: 'Загрузка...'
		},

		afterRender: function ()
		{
			var me = this,
				textPanel;

			textPanel = Ext.widget(
				{
					xtype: 'component',
					tpl: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><p class="message">{text}</p>'
				}
			);

			me.add(textPanel);
			me._textPanel = textPanel;

			me.callParent(arguments);
		},

		afterHide: function ()
		{
			var me = this;

			// устанавливаем текст по умолчанию
			me.setMessage();

			me.callParent(arguments);
		},

		/**
		 * Устанавливает сообщение.
		 * @param {String} [text] Текстовое сообщение.
		 */
		setMessage: function (text)
		{
			var me = this,
				textPanel = me._textPanel,
				defaultText = me.translateText.defaultText,
				data;

			data = {
				text: text || defaultText
			};
			textPanel.update(data);
		}
	}
);