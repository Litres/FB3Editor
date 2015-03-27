/**
 * Кнопка разделения окна редактирования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.view.button.split.Split',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.toolstab.view.button.split.SplitController'
		],
		id: 'panel-toolstab-view-button-split',
		xtype: 'panel-toolstab-view-button-split',
		controller: 'panel.toolstab.view.button.split',
		listeners: {
			click: 'onClick'
		},

		/**
		 * @private
		 * @property {Boolean} Включен ли режим рзаделения.
		 */
		splited: false,

		translateText: {
			split: 'Разделить',
			unsplit: 'Снять разделение'
		},

		initComponent: function ()
		{
			var me = this;

			me.text = me.translateText.split;
			me.callParent(this);
		},

		/**
		 * Устанавливает состояние кнопки.
		 * @param {Boolean} val Включен ли режим рзаделения.
		 */
		setSplited: function (val)
		{
			var me = this,
				text;

			me.splited = val;
			text = val ? me.translateText.unsplit : me.translateText.split;
			me.setText(text);
		},

		/**
		 * Проверяет состояние кнопки.
		 * @return {Boolean} val Включен ли режим рзаделения.
		 */
		isSplited: function ()
		{
			return this.splited;
		}
	}
);