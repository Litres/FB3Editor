/**
 * Абстрактный класс для кнопок переключения контетна.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.AbstractContent',
	{
		extend: 'Ext.button.Button',
		width: '100%',
		enableToggle: true,
		toggleGroup: 'content',

		afterRender: function ()
		{
			var me = this;

			me.syncContent();
			me.callParent(arguments);
		},

		/**
		 * @abstract
		 * Возвращает id панели контента, с которым связана кнопка.
		 * @return {String} Id панели контента.
		 */
		getContentId: function ()
		{
			throw Error('Не реализован метод view.button.AbstractContent#getContentId');
		},

		/**
		 * @private
		 * Синхронизирует состояние кнопки с панелью контента.
		 * Для соответствующего контента должна быть нажата соответствующая кнопка.
		 */
		syncContent: function ()
		{
			var me = this,
				contentId = me.getContentId(),
				bridgeWindow = FBEditor.getBridgeWindow(),
				content,
				activeItem;

			content = bridgeWindow.Ext.getCmp('panel-main-content');
			activeItem = content.getLayout().getActiveItem();
			if (activeItem.id === contentId)
			{
				me.setPressed();
			}
		}
	}
);