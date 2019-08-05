/**
 * Состояние редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.State',
	{
		extend: 'FBEditor.state.InterfaceState',
		
		/**
		 * @private
		 * @property {FBEditor.editor.Manager} Менеджер редактора текста.
		 */
		manager: null,
		
		constructor: function (manager)
		{
			this.manager = manager;
		},
		
		init: function ()
		{
			var me = this,
				appManager = me.getAppManager();
			
			// добавляем в участники состояния приложения
			appManager.addMember(me);
		},
		
		setItem: function (name, value)
		{
			var me = this,
				appState = me.getAppState();
			
			appState.setItem(name, value);
		},
		
		getItem: function (name)
		{
			var me = this,
				appState = me.getAppState();
			
			return appState.getItem(name);
		},
		
		removeItem: function (name)
		{
			var me = this,
				appState = me.getAppState();
			
			appState.removeItem(name);
		},
		
		save: function ()
		{
			//
		},
		
		/**
		 * Возвращает менеджер редактора текста.
		 * @return {FBEditor.editor.Manager}
		 */
		getManager: function ()
		{
			return this.manager;
		},
		
		/**
		 * Вовзращает менеджер состояния приложения.
		 * @return {FBEditor.state.Manager}
		 */
		getAppManager: function ()
		{
			return FBEditor.state.Manager;
		},
		
		/**
		 * Возвращает состояние приложения.
		 * @returns {FBEditor.state.State}
		 */
		getAppState: function ()
		{
			var me = this,
				appManager = me.getAppManager();
			
			return appManager.getState();
		}
	}
);