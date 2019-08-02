/**
 * Менеджер управления состоянием приложения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.state.Manager',
	{
		singleton: true,
		requires: [
			'FBEditor.state.State'
		],
		
		/**
		 * @private
		 * @property {FBEditor.state.State} Состояние приложения.
		 */
		state: null,
		
		/**
		 * Инициализирует менеджер.
		 */
		init: function ()
		{
			var me = this;
			
			me.state = Ext.create('FBEditor.state.State');
		},
		
		/**
		 * Возвращает текущее состояние приложения.
		 * @return {FBEditor.state.State}
		 */
		getState: function ()
		{
			return this.state;
		}
	}
);