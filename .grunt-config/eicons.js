const path = require( 'path' );
const fs = require( 'fs' );
const write = require('write');

class Eicons {
	constructor() {
		// Icons list that are being used in the frontend and can be imported as an HTML node element.
		this.frontendAvailableIcons = [
			'chevron-left',
			'chevron-right',
			'close',
			'download-bold',
			'facebook',
			'frame-expand',
			'frame-minimize',
			'loading',
			'pinterest',
			'share-arrow',
			'twitter',
			'zoom-in-bold',
			'zoom-out-bold',
		];
	}

	createFrontendIconsFile() {
		const svgIconsJsonPath = path.resolve( __dirname, '../assets/lib/eicons/eicons.json' );

		if ( fs.existsSync( svgIconsJsonPath ) ) {
			const svgIconsData = JSON.parse( fs.readFileSync( svgIconsJsonPath ) );

			let svgIconsJSContent = '// This file is automatically generated, please don\'t change anything in this file.\n';

			svgIconsJSContent += this.getIconsManagerInstanceContent();

			this.frontendAvailableIcons.forEach( ( iconName, index ) => {
				svgIconsJSContent += '\n\n' + this.getIconJSContent( iconName, svgIconsData[ iconName ] );
			} );

			svgIconsJSContent += '\n';

			const svgIconsJSDestination = path.resolve( __dirname, '../assets/dev/js/frontend/utils/icons/e-icons.js' );

			write.sync( svgIconsJSDestination, svgIconsJSContent );
		}
	}

	getIconsManagerInstanceContent() {
		return `import IconsManager from './manager';

const iconsManager = new IconsManager( 'eicon' );`;
	}

	getIconJSContent( iconName, svgData ) {
		const { path, width, height } = svgData,
			svgDataContent = `{
			path: '${ path }',
			width: ${ width },
			height: ${ height },
		}`;

		return `export const ${ this.dashCaseToCamelCase( iconName ) } = {
	get element() {
		const svgData = ${ svgDataContent };

		return iconsManager.createSvgElement( '${ iconName }', svgData );
	},
};`
	}

	dashCaseToCamelCase( string ) {
		return string.replace( /\b-([a-z])/g, ( _, char ) => char.toUpperCase() );
	}
}

module.exports = Eicons;