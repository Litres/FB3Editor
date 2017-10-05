/**
 * Абстракатный класс кнопки для операций над ресурсом.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.AbstractOperationResource',
	{
		extend: 'Ext.button.Button',
		requires: [
			'FBEditor.view.button.AbstractOperationResourceController'
		],

		controller: 'button.operation.resource',

		listeners: {
			click: {
				el: 'body',
				fn: 'onClick'
			}
		},

		width: '100%',

		/**
		 * @property {String} Класс команды, свзяанной с кнопкой.
		 */
		cmdClass: '',

		/**
		 * @private
		 * @property {String} Имя ресурса.
		 */
		nameResource: null,

		/**
		 * Устанавливает имя ресурса.
		 * @param {String} name Имя ресурса.
		 */
		setResource: function (name)
		{
			this.nameResource = name;
		}
	}
);