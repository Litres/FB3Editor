/**
 * Абстрактная кнопка элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.AbstractButton',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.panel.toolstab.main.button.ButtonController'
		],
		controller: 'panel.toolstab.main.button',

		disabled: true,

		listeners: {
			click: 'onClick',
			sync: 'onSync'
		},

		config: {
			/**
			 * @property {FBEditor.view.panel.toolstab.main.button.AbstractButton[]} Список однотипных кнопок.
			 */
			sequence: null
		},

		/**
		 * @property {Object} Опции, которые передаются в команду создания элемента.
		 */
		createOpts: null,

		/**
		 * Проверяет должна ли быть кнопка активной для текущего выделения в тексте.
		 * @return {Boolean} Активна ли.
		 */
		isActiveSelection: function ()
		{
			return false;
		}
	}
);