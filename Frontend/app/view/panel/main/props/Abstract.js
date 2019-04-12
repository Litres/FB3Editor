/**
 * Абстрактный класс для внутренних панелей свойств.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.Abstract',
	{
		extend: 'Ext.panel.Panel',

		afterRender: function ()
		{
			var me = this;

			me.syncContent();
			me.callParent(arguments);
		},

		/**
		 * @abstract
		 * Возвращает id панели контента, с которым связана панель свойств.
		 * @return {String} Id панели контента.
		 */
		getContentId: function ()
		{
			throw Error('Не реализован метод view.panel.main.props.Abstract#getContentId');
		},

		/**
		 * @private
		 * Синхронизирует состояние панели свойств с панелью контента.
		 * Для соответствующего контента должны быть показаны соответствующии свойства.
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
				Ext.getCmp('panel-main-props-card').setActiveItem(me.id);
			}
		}
	}
);