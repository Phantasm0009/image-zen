/**
 * Processing pipeline for chaining multiple image operations
 * Supports both synchronous and asynchronous operations
 */
class Pipeline {
  constructor(options = {}) {
    this.options = options;
    this.stages = [];
  }

  /**
   * Add a processing stage to the pipeline
   * @param {string} name - Stage name
   * @param {Object} processor - Processor instance
   * @param {*} args - Additional arguments for the processor
   */
  add(name, processor, ...args) {
    this.stages.push({
      name,
      processor,
      args,
      execute: async (input) => {
        switch (name) {
          case 'removeBackground':
            return await processor.process(input, ...args);
          case 'upscale':
            return await processor.process(input, ...args);
          case 'compress':
            return await processor.process(input, ...args);
          default:
            throw new Error(`Unknown stage: ${name}`);
        }
      }
    });
    
    return this; // Enable method chaining
  }

  /**
   * Execute the entire pipeline
   * @param {string|Buffer} input - Initial input
   * @returns {Promise<Buffer>} Final processed result
   */
  async execute(input) {
    let current = input;
    
    if (this.options.verbose) {
      console.log(`\nExecuting pipeline with ${this.stages.length} stage(s):`);
    }
    
    for (let i = 0; i < this.stages.length; i++) {
      const stage = this.stages[i];
      
      if (this.options.verbose) {
        console.log(`  ${i + 1}. ${stage.name}...`);
      }
      
      try {
        const startTime = Date.now();
        current = await stage.execute(current);
        const duration = Date.now() - startTime;
        
        if (this.options.verbose) {
          console.log(`     ✓ Completed in ${duration}ms`);
        }
        
      } catch (error) {
        throw new Error(`Pipeline failed at stage '${stage.name}': ${error.message}`);
      }
    }
    
    if (this.options.verbose) {
      console.log('Pipeline execution completed!\n');
    }
    
    return current;
  }

  /**
   * Get pipeline information
   * @returns {Object} Pipeline details
   */
  getInfo() {
    return {
      stageCount: this.stages.length,
      stages: this.stages.map(stage => ({
        name: stage.name,
        args: stage.args
      }))
    };
  }

  /**
   * Clear all stages
   */
  clear() {
    this.stages = [];
    return this;
  }

  /**
   * Remove a specific stage by name
   * @param {string} name - Stage name to remove
   */
  remove(name) {
    this.stages = this.stages.filter(stage => stage.name !== name);
    return this;
  }

  /**
   * Insert a stage at a specific position
   * @param {number} index - Position to insert at
   * @param {string} name - Stage name
   * @param {Object} processor - Processor instance
   * @param {*} args - Additional arguments
   */
  insert(index, name, processor, ...args) {
    this.stages.splice(index, 0, {
      name,
      processor,
      args,
      execute: async (input) => {
        switch (name) {
          case 'removeBackground':
            return await processor.process(input, ...args);
          case 'upscale':
            return await processor.process(input, ...args);
          case 'compress':
            return await processor.process(input, ...args);
          default:
            throw new Error(`Unknown stage: ${name}`);
        }
      }
    });
    
    return this;
  }

  /**
   * Create a copy of the pipeline
   * @returns {Pipeline} New pipeline instance with same stages
   */
  clone() {
    const newPipeline = new Pipeline(this.options);
    newPipeline.stages = [...this.stages];
    return newPipeline;
  }
}

module.exports = Pipeline;