export * from '../components/RobotbasFormField.vue'
export * from '../components/RobotbasAvatar.vue'
export * from '../components/RobotbasButton.vue'
export * from '../components/RobotbasInput.vue'
export * from '../components/RobotbasIcon.vue'
export * from '../components/RobotbasBadge.vue'
export * from '../components/RobotbasTree.vue'
export * from '../components/RobotbasChip.vue'
export * from './form'
export * from './locale'
export * from './utils'

// Create utility functions so ui values can be called as functions with optional `class` arg, following template usage
export function createUiFn(baseClass: string | boolean | undefined) {
  // baseClass: from props.ui?.item, etc, which may be undefined
  // Returns a function accepting an options object (with 'class'), returning a string of classes
  return (opts: { class?: any } = {}) => {
    const classes = [];
    if (typeof baseClass === 'string') classes.push(baseClass);
    if (opts.class) {
      if (Array.isArray(opts.class)) {
        classes.push(...opts.class.filter(Boolean));
      } else if (typeof opts.class === 'string') {
        classes.push(opts.class);
      } else if (typeof opts.class === 'object' && opts.class != null) {
        // Support for object/class binding (e.g., { foo: true, bar: false })
        Object.entries(opts.class).forEach(([k, v]) => { if (v) classes.push(k) });
      }
    }
    return classes.join(' ');
  };
}
