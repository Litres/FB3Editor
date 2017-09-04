/**
 * Адаптивная панель с кнопками, которые не поместились на панели форматирования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.toolbar.responsive.panel.Panel',
	{
		extend: 'Ext.Panel',
		requires: [
			'FBEditor.view.panel.main.editor.toolbar.responsive.panel.PanelController'
		],

		xtype: 'main-editor-toolbar-responsive-panel',
		controller: 'main.editor.toolbar.responsive.panel',
		cls: 'main-editor-toolbar-responsive-panel',

		config: {
			keyHandlers: {
				ESC: 'onEscKey'
			}
		},

		floating: true,
		closeAction: 'hide',
		layout: {
			type: 'vbox',
			padding: 2,
			align: 'stretchmax'
		},

		/**
		 * @property {Boolean} Открыта ли панель.
		 */
		isShow: false,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.toolbar.responsive.button.Button} Адаптивная кнопка.
		 */
		responsiveButton: null,

		onShow: function ()
		{
			var me = this;

			me.callParent(arguments);

			me.updatePanel();
			me.align();
			me.isShow = true;
		},

		afterShow: function()
		{
			var me = this;

			// добавляем обработчик события клика по всему документу, чтобы иметь возможность закрывать окно
			Ext.getBody().on('click', me.onClickBody, me);

			me.callParent(arguments);
		},

		afterHide: function ()
		{
			var me = this;

			me.isShow = false;

			// удаляем обработчик клика по всему документу, чтобы не висел зря и не копился
			Ext.getBody().un('click', me.onClickBody, me);

			me.callParent(arguments);

			me.removeAll();
		},

		/**
		 * Обновляет панель.
		 */
		updatePanel: function ()
		{
			var me = this,
				button = me.getResponsiveButton(),
				hiddenButtons,
				toolbar;

			toolbar = button.getToolbar();
			hiddenButtons = toolbar.getHiddenButtons();

			//console.log('updatePanel', hiddenButtons);
			
			if (hiddenButtons)
			{
				// добавляем кнопки
				me.add(hiddenButtons);
				
				// синхронизируем добавленные кнопки
				toolbar.fireEvent('syncHiddenButtons', hiddenButtons);
			}
		},

		/**
		 * Устанавливает связь с адаптивной кнопкой.
		 * @param {FBEditor.view.panel.main.editor.toolbar.responsive.button.Button} button
		 */
		setResponsiveButton: function (button)
		{
			this.responsiveButton = button;
		},

		/**
		 * Возвращает адаптивную кнопку.
		 * @return {FBEditor.view.panel.main.editor.toolbar.responsive.button.Button}
		 */
		getResponsiveButton: function ()
		{
			return this.responsiveButton;
		},

		/**
		 * Выравнивает адаптивную панель относительно адаптивной кнопки.
		 */
		align: function ()
		{
			var me = this,
				responsiveButton = me.getResponsiveButton(),
				offsetLeft;

			if (responsiveButton.isVisible() && responsiveButton.rendered)
			{
				offsetLeft = -(me.getWidth());
				me.alignTo(responsiveButton, 'br', [offsetLeft, 0]);
			}
		},

		/**
		 * @private
		 * Закрывает панель, если клик произошел не по области панели.
		 */
		onClickBody: function (e, input)
		{
			var me = this;

			me.close();
		}
	}
);