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
		 * @private
		 * @property {Object} Список всех участников состояния приложения.
		 */
		members: null,
		
		/**
		 * Инициализирует менеджер.
		 */
		init: function ()
		{
			var me = this;
			
			// состояние приложения
			me.state = Ext.create('FBEditor.state.State');
			me.state.init();
			
			// список участников состояния
			me.members = new Ext.util.MixedCollection();
			me.members.add(me.state);
		},
		
		/**
		 * Возвращает текущее состояние приложения.
		 * @return {FBEditor.state.State}
		 */
		getState: function ()
		{
			return this.state;
		},
		
		/**
		 * Возвращает список всех участников состояния приложения.
		 * @return {Object}
		 */
		getMembers: function ()
		{
			return this.members;
		},
		
		/**
		 * Добавляет нового участника состояния приложения.
		 * @param {FBEditor.state.InterfaceState} state Участник состояния приложения.
		 */
		addMember: function (state)
		{
			var me = this,
				members = me.getMembers();
			
			members.add(state);
		},
		
		/**
		 * Сохраняет состояние приложения.
		 */
		saveState: function ()
		{
			var me = this,
				members = me.getMembers();
			
			// перебираем всех участников и сохраняем их состояние
			members.each(
				function (member)
				{
					member.save();
				}
			);
		}
	}
);